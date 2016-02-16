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

if [ -z "$AUTH_UI_VERSION" ]; then
    echo "AUTH_UI_VERSION does not exist."
    exit 1
fi

if [ -z "$AUTH_API_VERSION" ]; then
    echo "AUTH_API_VERSION does not exist."
    exit 1
fi

SCRIPT_DIR=$( script_dir )
APP_HOME=$( dirname $( dirname $SCRIPT_DIR ) )

DOCKER_COMPOSE_TEMPLTE_PATH=${SCRIPT_DIR}/docker-compose.yml.template
DOCKER_COMPOSE_PATH=${SCRIPT_DIR}/docker-compose.yml

TEMP_FILE=$( mktemp 2>/dev/null || mktemp -t 'auth-ui' )

trap "rm -rf $TEMP_FILE $DOCKER_COMPOSE_PATH" EXIT
trap "exit 1" 1 2 3 13 15

(
  echo 'cat <<EndOfDoc'
  cat $DOCKER_COMPOSE_TEMPLTE_PATH
  echo 'EndOfDoc'
) > $TEMP_FILE
. $TEMP_FILE > $DOCKER_COMPOSE_PATH

docker-compose -f $DOCKER_COMPOSE_PATH "$@"
