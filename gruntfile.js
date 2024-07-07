module.exports = function (grunt) {

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
                src: [
                    '**/*.jade',          // Include all .jade files
                    '!includes/**'      // Exclude the "exclude-me" folder and its contents
                ],
                dest: "dist/",
                ext: '.html'
            }
        },
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'build/sass/',
                    src: ['*.scss'],
                    dest: 'dist/css/',
                    ext: '.css'
                }]
            }
        },
        watch: {
            jade: {
                files: "build/**/*.jade",
                tasks: "jade"
            },
            sass: {
                files: "build/**/*.scss",
                tasks: 'sass'
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        "dist/css/*.css",
                        "dist/*.html"
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "./dist"
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.registerTask('default', ['browserSync', 'watch']);


};