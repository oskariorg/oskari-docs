# setting path to node, grunt, etc
PATH=$PATH:/usr/local/bin

# hardcoded paths
SERVER=oskaritu01.nls.fi
OSKARI_DIR=oskari.org
OSKARI_REPO=ssh://git@haisulike01/oskari.org
REMOTE_USER=jenkins
REMOTE_GROUP=tracadmin
KEYFILE=/var/lib/jenkins/.ssh/newdemo
DEST_DIR=/opt/node/oskari.org

# declaring global variables and job settings
BRANCH=${branch}

# check the oskari.org directory exists, if not, clone oskari.org from git repository
test -d ${OSKARI_DIR} || git clone ${OSKARI_REPO}

# checkout and pull
cd ${OSKARI_DIR}
git fetch --all
git checkout -- .
git checkout ${BRANCH}
git pull

# Packing
PACKED=$( mktemp -p . )

# archive oskari.org to temporary package directory
tar czf ${PACKED} .

# Deploy
unset COMMANDS
# create destination directory creating parents as needed and without error if existing
COMMANDS[${#COMMANDS[*]}]="mkdir -p ${REMOTE_USER}:${REMOTE_GROUP} ${DEST_DIR}"
# unarchive packed in tmp folder to destination directory
COMMANDS[${#COMMANDS[*]}]="tar -C ${DEST_DIR} -xzf /tmp/$( basename ${PACKED} )"
# change ownership on destination directory
COMMANDS[${#COMMANDS[*]}]="chown -R ${REMOTE_USER}:${REMOTE_GROUP} ${DEST_DIR}"
# install npm dependencies
COMMANDS[${#COMMANDS[*]}]="cd ${DEST_DIR} && npm install"
# build the assets
COMMANDS[${#COMMANDS[*]}]="cd ${DEST_DIR} && gulp build"
# restart the node application
COMMANDS[${#COMMANDS[*]}]="sudo restart oskari"
# remove archive from tmp folder
COMMANDS[${#COMMANDS[*]}]="rm /tmp/$( basename ${PACKED} )"

# copy packed archive to destination tmp folder
scp -i ${KEYFILE} $( basename ${PACKED} ) ${REMOTE_USER}@${SERVER}:/tmp

# running remote commands
for CMD in "${COMMANDS[@]}"
do
  echo "    ${CMD}"
  ssh -i ${KEYFILE} ${REMOTE_USER}@${SERVER} "${CMD}"
done

# cleanup, remove temporary archive
rm -f ${PACKED}