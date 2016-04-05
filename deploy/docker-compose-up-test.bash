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

AUTH_NETWORK=auth-net
AUTH_NETWORK_ID=$( docker network ls -f name=${AUTH_NETWORK} -q )
if [ -z "$AUTH_NETWORK_ID" ]; then
    echo "Create docker network $AUTH_NETWORK"
    docker network create --driver bridge $AUTH_NETWORK
fi

docker-compose -f ${SCRIPT_DIR}/docker-compose-test.yml up -d db
sleep 2
docker-compose -f ${SCRIPT_DIR}/docker-compose-test.yml run --rm auth-api bin/rails db:setup
docker-compose -f ${SCRIPT_DIR}/docker-compose-test.yml run --rm users-api bin/rails db:setup

docker-compose -f ${SCRIPT_DIR}/docker-compose-test.yml up -d auth-api users-api auth-ui

AUTH_API_CONTAINER=$( docker-compose -f ${SCRIPT_DIR}/docker-compose-test.yml ps -q auth-api )
docker network connect --alias auth-api $AUTH_NETWORK $AUTH_API_CONTAINER
USERS_API_CONTAINER=$( docker-compose -f ${SCRIPT_DIR}/docker-compose-test.yml ps -q users-api )
docker network connect --alias users-api $AUTH_NETWORK $USERS_API_CONTAINER
