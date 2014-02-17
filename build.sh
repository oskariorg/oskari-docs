# setting path to node, grunt, etc
PATH=$PATH:/usr/local/bin

# hardcoded paths
# the oskari.org production server
SERVER=oskaritu01.nls.fi
# oskari.org directory
OSKARI_DIR=oskari.org
# the oskari.org git repo
OSKARI_REPO=ssh://git@haisulike01/oskari.org
REMOTE_USER=jenkins
REMOTE_GROUP=tracadmin
KEYFILE=/var/lib/jenkins/.ssh/newdemo
# the app directory on the production server
DEST_DIR=/opt/node/oskari.org
# archived oskari packages
ARCHIVE_DIR=/tmp/oskari

# add these to the tar file
VIEWS=views
PUBLIC=public
CLIENT=client
MD=md
APP=app.js
GULPFILE=gulpfile.js
PACKAGE=package.json

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

# copy the archived oskari distributions if they exist
if [ -d ${ARCHIVE_DIR} ];
then
    mkdir -p public/release && cp ${ARCHIVE_DIR}/* public/release/
else
    echo "Archived oskari packages do not exist. Maybe run Oskari frontend build first?"
fi

# Packing
PACKED=$( mktemp -p . )

# archive oskari.org to temporary package directory
tar czf ${PACKED} $VIEWS $PUBLIC $CLIENT $MD $APP $GULPFILE $PACKAGE

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

# restart the node application
ssh -i ${KEYFILE} -t ${REMOTE_USER}@${SERVER} "sudo restart oskari"

# cleanup, remove temporary archive
rm -f ${PACKED}