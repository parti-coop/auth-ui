#!/usr/bin/env bash

PROG=`basename $0`

usage() {
    echo "Usage: $PROG -n app-name -a app-version -p profile -s s3bucket" >&2
}

getopt -T > /dev/null
if [ $? -eq 4 ]; then
    # GNU enhanced getopt is available
    ARGS=`getopt --name "$PROG" --long app-name:,app-version:,s3bucket: --options n:a:s: -- "$@"`
else
    # Original getopt is available (no long option names, no whitespace, no sorting)
    ARGS=`getopt n:a:s: "$@"`
fi
if [ $? -ne 0 ]; then
    usage
    exit 2
fi
eval set -- $ARGS

while [ $# -gt 0 ]; do
    case "$1" in
        -n | --app-name)    APP_NAME="$2"; shift;;
        -a | --app-version) APP_VERSION="$2"; shift;;
        -s | --s3bucket) APP_S3BUCKET="$2"; shift;;
        --)              shift; break;; # end of options
    esac
    shift
done

# Remaining parameters can be processed
#  for ARG in "$@"; do
#    echo "$PROG: argument: $ARG"
#  done

if [ -z "$APP_NAME" ] || [ -z "$APP_VERSION" ] || [ -z "$APP_S3BUCKET" ]; then
    usage
    exit 2
fi

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
APP_HOME=$( dirname $( dirname $SCRIPT_DIR ) )

APP_SOURCE_BUNDLE=parti-auth-eb-${APP_VERSION}.zip
APP_SOURCE_BUNDLE_BUCKET=${APP_S3BUCKET}
EB_DOCKERRUN_TEMPLTE_PATH=${SCRIPT_DIR}/Dockerrun.aws.json.template

CHECK_VERSION=$(
    aws elasticbeanstalk describe-application-versions \
        --application-name ${APP_NAME} \
        --version-label ${APP_VERSION} \
    | grep VersionLabel
)

if [ -n "$CHECK_VERSION" ]; then
    echo "Version $APP_VERSION already exists."
    echo "Delete Version ${APP_VERSION}."
    aws elasticbeanstalk delete-application-version \
        --application-name ${APP_NAME} \
        --version-label ${APP_VERSION}
fi

TEMP_APP_SOURCE_DIR=$( mktemp -d 2>/dev/null || mktemp -d -t 'auth-ui.d' )
TEMP_FILE=$( mktemp 2>/dev/null || mktemp -t 'auth-ui' )
trap "rm -rf $APP_SOURCE_BUNDLE $TEMP_FILE $TEMP_APP_SOURCE_DIR" EXIT
trap "exit 1" 1 2 3 13 15

# TEMP_APP_SOURCE_DIR=${APP_HOME}/tmp.d
# TEMP_FILE=${APP_HOME}/tmp
# rm -rf $TEMP_APP_SOURCE_DIR $TEMP_FILE
# mkdir -p $TEMP_APP_SOURCE_DIR

(
  echo 'cat <<EndOfDoc'
  cat $EB_DOCKERRUN_TEMPLTE_PATH
  echo 'EndOfDoc'
) > $TEMP_FILE
. $TEMP_FILE > ${TEMP_APP_SOURCE_DIR}/Dockerrun.aws.json

cd ${TEMP_APP_SOURCE_DIR} && zip -r ${APP_SOURCE_BUNDLE} .

aws s3 cp ${APP_SOURCE_BUNDLE} s3://${APP_S3BUCKET}

aws elasticbeanstalk create-application-version \
    --application-name ${APP_NAME} \
    --auto-create-application \
    --version-label ${APP_VERSION} \
    --source-bundle S3Bucket="${APP_SOURCE_BUNDLE_BUCKET}",S3Key="${APP_SOURCE_BUNDLE}"
