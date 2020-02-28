module.exports = function(grunt) {

    grunt.initConfig({
        options: {
            pretty: true
        },
        jade: {
                options: {
                    data: {
                        debug: false
                    },
                    pretty: true
                },
                all: {
                    expand: true,
                    cwd: "build/",
                    src: ["*.jade"],
                    dest: "dist/",
                    ext: '.html'
                }
            
        },
        watch: {
            jade: {
              files:["build/**/*.jade"],
              tasks: "jade"
            }
          }
    });
  
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['watch']);
  
  };