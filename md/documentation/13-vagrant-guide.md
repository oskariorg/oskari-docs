# Getting started with Vagrant

**Disclaimer:**
*The Vagrant box contains files for oracle jdk 1.7.*
*By using this setup you accept the [Oracle Binary Code License Agreement for Java SE](http://www.oracle.com/technetwork/java/javase/terms/license/index.html).*
*If the inclusion of oracle jdk 1.7 is a problem, please contact paikkatietoikkuna[at]maanmittauslaitos.fi*

We have built a functional Oskari environment in a Vagrant box.

* You'll need to install [Virtualbox](https://www.virtualbox.org/wiki/Downloads) and [Vagrant](http://www.vagrantup.com/downloads.html) to use the box.
* Download the Vagrantfile: http://oskari.org/boxes/Vagrantfile-dev to <work_dir>
* Rename file to <work_dir>/Vagrantfile
* Open a terminal or command prompt and change into the same directory where the Vagrantfile is (<work_dir>.
* Run 'vagrant up' to start the box
* Try to access http://localhost:8080 on your browser to see oskari-map
* On command prompt go to <work_dir> and run 'vagrant ssh' (use Putty on Windows) to access the box and also start the server inside the box
* In the opened ssh prompt run command './start.sh'
> * Oskari code is now available for editing in <work_dir> and nano-editor is opened with nginx config file <br>
> * Change the line (line ~ 10) root/home/vagrant/; to root/vagrant; <br>
> * ctrl + x to exit, Y to save file and enter to accept location <br>
> * you should now be in ssh prompt with message "All set!" on the previous line <br>
* Start editing the code under <work_dir>/Oskari and <work_dir>/oskari-server
> * frontend changes should be visible by refreshing the browser page <br>
> * to compile and deploy backend code to the server, run './deploy.sh' in the ssh prompt <br>
> * server logs in (ssh prompt): /data/log/jetty-hightide/yyyy_MM_dd.stderr.out <br>


**Note!**
*This is a beta release for the Oskari Ubuntu Precise 10.12 LTS Vagrant Box. It is still a bit rough around the edges and improvements are done gradually. This image is not intended for production use!*