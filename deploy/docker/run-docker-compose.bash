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

export AUTH_UI_VERSION=${AUTH_UI_VERSION:-$( git describe --tags --long )}

SCRIPT_DIR=$( script_dir )
APP_HOME=$( dirname $( dirname $SCRIPT_DIR ) )

export AUTH_API_VERSION=0.1.1-0-g3b958d3

${SCRIPT_DIR}/docker-compose.bash up
