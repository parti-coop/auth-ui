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

export APP_VERSION=${APP_VERSION:-$( git describe --tags --long )}

${SCRIPT_DIR}/eb-create-env.bash \
	--cname-prefix parti-auth-pr \
	--app-name ${APP_NAME} \
	--app-version ${APP_VERSION} \
	--env-name ${APP_ENV_NAME} \
	--env-type SingleInstance \
	--iam-role ${APP_IAM_ROLE} \
	--key-pair ${APP_KEY_PAIR} \
	--security-groups ${APP_SECURITY_GROUPS}
