#!/usr/bin/env bash

script_dir() {
    local source="${BASH_SOURCE[0]}"
    while [ -h "$source" ] ; do # resolve $SOURCE until the file is no longer a symlink
        local dir="$( cd -P "$( dirname "$source" )" && pwd )"
        source="$( readlink "$source" )";
        # if $source was a relative symlink
        # we need to resolve it relative to the path where the symlink file was located
        [[ $source != /* ]] && source="$dir/$source"
    done
    printf "$( cd -P "$( dirname "$source" )" && pwd )"
}

SCRIPT_DIR=$( script_dir )
ROOT_DIR=$( dirname $SCRIPT_DIR )

DOCKER_COMPOSE_FILE=${DOCKER_COMPOSE_FILE:-${SCRIPT_DIR}/docker-compose-deps.yml}

AUTH_NETWORK=auth-net
AUTH_NETWORK_ID=$( docker network ls -f name=${AUTH_NETWORK} -q )
if [ -z "$AUTH_NETWORK_ID" ]; then
    echo "Create docker network $AUTH_NETWORK"
    docker network create --driver bridge $AUTH_NETWORK
fi

docker-compose -f ${DOCKER_COMPOSE_FILE} up -d db
sleep 2
docker-compose -f ${DOCKER_COMPOSE_FILE} run --rm auth-api bin/rails db:setup
docker-compose -f ${DOCKER_COMPOSE_FILE} run --rm users-api bin/rails db:setup
docker-compose -f ${DOCKER_COMPOSE_FILE} up -d auth-api users-api

AUTH_API_CONTAINER=$( docker-compose -f ${DOCKER_COMPOSE_FILE} ps -q auth-api )
docker network connect $AUTH_NETWORK $AUTH_API_CONTAINER
USERS_API_CONTAINER=$( docker-compose -f ${DOCKER_COMPOSE_FILE} ps -q users-api )
docker network connect --alias users-api $AUTH_NETWORK $USERS_API_CONTAINER
