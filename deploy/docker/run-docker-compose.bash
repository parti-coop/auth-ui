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
export AUTH_UI_VERSION=${AUTH_UI_VERSION:-latest}

SCRIPT_DIR=$( script_dir )
APP_HOME=$( dirname $( dirname $SCRIPT_DIR ) )

export AUTH_API_VERSION=0.1.0-1-ge38f351

${SCRIPT_DIR}/docker-compose.bash up
