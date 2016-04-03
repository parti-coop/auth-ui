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

encrypt_file () {
  secret=$1
  file=$2
  openssl aes-256-cbc -a -k "$secret" -in $file -out $file.enc || return 1
}

travis_cust_enc () {
  file=$1

  secret=`cat /dev/urandom | head -c 10000 | md5` || return 1
  encrypt_file $secret $file || return 1
  travis encrypt secret=$secret --add
}

SCRIPT_DIR=$( script_dir )
ROOT_DIR=$( dirname $SCRIPT_DIR )

cd $ROOT_DIR
travis_cust_enc "$@"
