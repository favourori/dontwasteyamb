
Vue.component('user-message', {
    mounted() {
        this.getAuthUser();
        this.getContacts();
        Event.$on('open', (id, firstname, lastname) => {
            this.chatter_name = firstname + " " + lastname;
            this.clicked = true;
            this.getUserMessages(id);
        });
    },
    data() {
        return {
            message: "",
            messages: [],
            message_id: 0,
            chatter_name: '',
            contacts: [],
            auth: 0,
            clicked: false
        }
    },

    methods: {
        emitValue(id, firstname, lastname) {
            this.chatter_name = firstname + " " + lastname;
            this.clicked = true;
            this.getUserMessages(id);
        },
        listen(id) {

            Echo.channel('message-' + id)
                .listen('SendMessageSignal', (e) => {
                    if (this.message_id == e.message_stream.message_id) {
                        this.getUserMessages(this.message_id);
                    }
                });
        },
        getAuthUser() {
            axios.get('/api/v1/auth')
                .then(response => {
                    this.auth = response.data.data.id;

                })
                .catch(err => {

                });
        },
        getContacts() {
            axios.get('/api/v1/contacts')
                .then(response => {
                    this.contacts = response.data.data;

                }).then(() => {
                    let contact_list = this.contacts
                    for (let i = 0; i < contact_list.length; i++) {
                        this.listen(contact_list[i].id);
                    }

                })
                .catch(err => {

                });
        },
        getUserMessages: function (id) {
            axios.get('/api/v1/messages/related/' + id)
                .then(response => {
                    this.messages = response.data.data;
                    this.message_id = id;
                }).then(() => {
                    this.scrollToBottom();
                }

                )
                .catch(err => {

                });
        },

        proper(sender_id) {
            return sender_id != this.auth;
        },
        chat(event) {
            if (event.keyCode == '13') {
                axios.post('/api/v1/chat/' + this.message_id, { message: this.message })
                    .then(response => {
                        this.messages.push(response.data.data);
                        this.message = "";
                        this.scrollToBottom();

                    })
                    .catch(err => {

                    });
            }

        },

        formatTime(time) {
            return moment(time).format('HH:mm');
        },

        scrollToBottom() {
            var messageHeight = parseInt($('#message-scroll').height()) + (30000 * 4);

            $('#message-scroll').animate({ scrollTop: messageHeight }, 1000, 'swing', function () {

            });
        }
    }
});


function showNumber(event, num) {

    $("#show-number").text(num);
}



function avatarChange() {
    $("#avatar").trigger('click');
}

function uploadAvatar() {
    let file = new FormData();
    $("#avatar-display").LoadingOverlay('show');
    let files = document.querySelector('#avatar').files;
    let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    $.each(files, function (key, value) {
        file.append('avatar', value);
    });
    file.append('_token', token);

    axios.post('/api/v1/account/avatar/update', file)
        .then(response => {
            success('Success', 'Avatar Update Successful');
            $("#avatar-display").LoadingOverlay('hide');
            $("#avatar").val("");
            $("#avatar-display").attr("src", response.data.data.profile.avatar);
        })
        .catch(err => {
            $("#avatar-display").LoadingOverlay('hide');
            if (err.response.data.response == 422) {
                error('Oops!', 'Check required fields')
                this.errors = err.response.data.errors;
            }
            if (err.response.data.response == 401) {
                error('Oops!', 'Not Authorized')
            }
            if (err.response.data.response == 404) {
                error('Oops!', err.response.data.message)
            }
        });

}

$("#avatar").change(function () {
    uploadAvatar();
});



window.Event = new Vue();

var vapp = new Vue({
    el: '#root',
    data: {
        csrf: document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        firstname: '',
        lastname: '',
        profile: {},
        website: '',
        errors: {},
        countries: [],
        states: [],
        country_id: 0,
        state_id: 0,
        lga_id: 0,
        lgas: [],
        lga_off: true,
        state_off: true,
        subcategory_off: true,
        type_off: true,
        subtype_off: true,
        latitude: 0,
        longitude: 0,
        address: '',
        phone: '',
        facebook: '',
        twitter: '',
        instagram: '',
        google: '',
        snapchat: '',
        linkedin: '',
        categories: [],
        subcategories: [],
        types: [],
        subtypes: [],
        category_id: 0,
        subcategory_id: 0,
        type_id: 0,
        subtype_id: 0,
        specifications: [],
        title: '',
        price: 0,
        phone1: '',
        address1: '',
        description: '',
        search: {
            result: false,
            query: [],
            category_id: 0
        },
        param: '',
        report: '',
        store_name: '',
        store_url: '',
        store_description: '',
        specs: [],
        advert_edit_id: ''

    },

    watch: {

        param: function (oldval, newval) {
            this.search.result = false;
            this.search.query = [];
            if (this.param.trim().length == 0) {
                this.search.query = [];
            } else {
                var self = this;
                // setTimeout(function () { self.searchAdvert() }, 500);

            }

        },
        country_id: function (oldval, newval) {
            if (oldval != 0) {
                this.getStates();
                this.state_off = false;
            } else {
                this.state_off = true;
            }

        },
        state_id: function (oldval, newval) {
            if (oldval != 0) {
                this.getLgas();
                this.lga_off = false;
            } else {
                this.lga_off = true;
            }

        },

        category_id: function (oldval, newval) {
            if (oldval != 0) {
                this.getSubCategories();

                this.subcategory_off = false;
            } else {
                this.getSubCategories();
                this.subcategory_off = true;
            }

        },

        subcategory_id: function (oldval, newval) {
            if (oldval != 0) {
                this.getTypes();
                this.type_off = false;
            } else {
                this.getTypes();
                this.type_off = true;
            }

        },

        type_id: function (oldval, newval) {
            if (oldval != 0) {
                this.getSubTypes();
                this.type_off = false;
            } else {
                this.type_off = true;
            }

        },

        avatar: function (oldval, newval) {
            this.updateAvatar();
        }


    },

    mounted() {

        this.getCountries();
        this.getUser();
        this.getCategories();
        this.getUserProfile();

        var href = location.href;
        var regex = /account\/advert\/edit\/?(.*)/;
        if (regex.test(href)) {
            // console.log(href);
            var match = regex.exec(href);
            this.getAdvertDetail(match[1]);
            this.advert_edit_id = match[1];
        }

    },

    methods: {

        emitValue(id, firstname, lastname) {
            Event.$emit('open', id, firstname, lastname);
        },

        addInput() {
            this.specs.push(1);
        },

        removeInput(index) {
            this.specs.splice(index - 1, 1);
            this.specifications.splice(index - 1, 1);
        },

        getAdvertDetail(id) {
            axios.get('/account/advert/edit/get/' + id)
                .then(response => {
                    let info = response.data.data;
                    this.subcategory_id = info.subcategory_id;
                    this.category_id = info.category_id;
                    this.title = info.title;
                    this.description = info.description;
                    this.price = info.price;
                    this.phone1 = info.phone;
                    this.address1 = info.address;
                    this.country_id = info.country_id;
                    this.state_id = info.state_id;
                    this.lga_id = info.lga_id;

                    for (var i = 0; i < info.specifications.length; i++) {
                        this.specifications.push(info.specifications[i].specification);
                    }

                    for (var i = 0; i < info.image.length; i++) {
                        // this piece of code figures out which image to put on which box
                        //regex checks for a patten image([1-6])
                        var regex = /\/image(\d)/;
                        if (regex.test(info.image[i].image)) {

                            var match = regex.exec(info.image[i].image);
                            let imageId = match[1];
                            $('#' + 'image-show' + imageId).attr('src', info.image[i].image)
                        }
                        ;
                    }
                })
                .catch(err => {
                    if (err.response.data.response == 422) {
                        error('Oops!', 'Check required fields')
                        this.errors = err.response.data.errors;
                    }
                    if (err.response.data.response == 401) {
                        error('Oops!', 'Not Authorized')
                    }
                    if (err.response.data.response == 404) {
                        error('Oops!', err.response.data.message)
                    }
                });
        },

        reportAdvert(id) {
            let data = {
                _token: this.csrf,
                report: this.report
            };
            axios.post('/advert/report/' + id, data)
                .then(response => {
                    success('Success', 'You have reported this advert');
                })
                .catch(err => {
                    if (err.response.data.response == 422) {
                        error('Oops!', 'Check required fields')
                        this.errors = err.response.data.errors;
                    }
                    if (err.response.data.response == 401) {
                        error('Oops!', 'Not Authorized')
                    }
                    if (err.response.data.response == 404) {
                        error('Oops!', err.response.data.message)
                    }
                });
        },

        searchAdvert() {
            // if (this.search.category_id == 0) {
            //     error('Oops!', 'Select a Category');
            //     return;
            // }
            data = {

                param: this.param,
                _token: this.csrf
            }
            axios.post('/advert/search', data)
                .then(response => {
                    this.search.query = response.data.data;
                    this.search.result = this.search.query.length > 0 ? true : false;
                })
                .catch(err => {
                    if (err.response.data.response == 422) {
                        error('Oops!', 'Check required fields')
                        this.errors = err.response.data.errors;
                    }
                    if (err.response.data.response == 401) {
                        error('Oops!', 'Not Authorized')
                    }
                    if (err.response.data.response == 404) {
                        error('Oops!', err.response.data.message)
                    }
                });
        },

        // Update Profile
        updateProfile() {
            let data = {
                firstname: this.firstname,
                lastname: this.lastname,
                _token: this.csrf
            }
            axios.post('/account/profile/update', data)
                .then(response => {
                    success('Success', 'Profile Update Successful');
                })
                .catch(err => {
                    if (err.response.data.response == 422) {
                        error('Oops!', 'Check required fields')
                        this.errors = err.response.data.errors;
                    }
                    if (err.response.data.response == 401) {
                        error('Oops!', 'Not Authorized')
                    }
                    if (err.response.data.response == 404) {
                        error('Oops!', err.response.data.message)
                    }
                });
        },

        // Update Profile
        updateAvatar() {
            let file = new FormData();
            let files = document.querySelector('#avatar').files;
            $.each(files, function (key, value) {
                file.append('avatar', value);
            });

            axios.post('/account/avatar/update', file)
                .then(response => {
                    success('Success', 'Profile Update Successful');
                })
                .catch(err => {
                    if (err.response.data.response == 422) {
                        error('Oops!', 'Check required fields')
                        this.errors = err.response.data.errors;
                    }
                    if (err.response.data.response == 401) {
                        error('Oops!', 'Not Authorized')
                    }
                    if (err.response.data.response == 404) {
                        error('Oops!', err.response.data.message)
                    }
                });
        },

        // Update contact
        updateContact() {
            let data = {
                // latitude: document.getElementById('latitude').value,
                // longitude: document.getElementById('longitude').value,
                address: this.address,
                country_id: this.country_id,
                state_id: this.state_id,
                lga_id: this.lga_id,
                website: this.website,
                phone: this.phone,
                _token: this.csrf
            }
            axios.post('/account/address/update', data)
                .then(response => {
                    success('Success', 'Contact Update Successful');
                })
                .catch(err => {
                    if (err.response.data.response == 422) {
                        error('Oops!', 'Check required fields')
                        this.errors = err.response.data.errors;
                    }
                    if (err.response.data.response == 401) {
                        error('Oops!', 'Not Authorized')
                    }
                    if (err.response.data.response == 404) {
                        error('Oops!', err.response.data.message)
                    }
                });
        },

        // Update contact
        updateSocial() {
            let data = {
                facebook: this.facebook,
                twitter: this.twitter,
                instagram: this.instagram,
                snapchat: this.snapchat,
                linkedin: this.linkedin,
                google: this.google,
                _token: this.csrf
            }
            axios.post('/account/social/update', data)
                .then(response => {
                    success('Success', 'Socials Update Successful');
                })
                .catch(err => {
                    if (err.response.data.response == 422) {
                        error('Oops!', 'Check required fields')
                        this.errors = err.response.data.errors;
                    }
                    if (err.response.data.response == 401) {
                        error('Oops!', 'Not Authorized')
                    }
                    if (err.response.data.response == 404) {
                        error('Oops!', err.response.data.message)
                    }
                });
        },

        // gets user
        getUser() {

            axios.get('/account/apiuser')
                .then(response => {
                    this.firstname = response.data.data.firstname;
                    this.lastname = response.data.data.lastname;
                })
                .catch(err => {

                });
        },

        // gets user
        getCategories() {

            axios.get('/api/v1/categories')
                .then(response => {
                    this.categories = response.data.data;

                })
                .catch(err => {

                });
        },

        // gets user
        getSubCategories() {

            axios.get('/api/v1/subcategories/' + this.category_id)
                .then(response => {
                    this.subcategories = response.data.data;
                })
                .catch(err => {

                });
        },

        // gets user
        getTypes() {

            axios.get('/api/v1/types/' + this.subcategory_id)
                .then(response => {
                    this.types = response.data.data;

                })
                .catch(err => {

                });
        },

        // gets user
        getSubType() {

            axios.get('/api/v1/subtypes/' + this.type_id)
                .then(response => {
                    this.subtypes = response.data.data;

                })
                .catch(err => {

                });
        },

        // Gets user profile
        getUserProfile() {

            axios.get('/account/apiprofile')
                .then(response => {
                    this.facebook = response.data.data.facebook;
                    this.twitter = response.data.data.twitter;
                    this.instagram = response.data.data.instagram;
                    this.snapchat = response.data.data.snapchat;
                    this.google = response.data.data.google;
                    this.linkedin = response.data.data.linkedin;
                    this.profile = response.data.data;
                    // document.getElementById('latitude').value = this.profile.latitude;
                    // document.getElementById('longitude').value = this.profile.longitude;
                    if (this.profile.state_id != null) {
                        this.state_id = this.profile.state_id;
                        this.state_off = false;
                    }
                    if (this.profile.lga_id != null) {
                        this.lga_id = this.profile.lga_id;
                        this.lga_off = false;
                    }
                    if (this.profile.country_id != null) {
                        this.country_id = this.profile.country_id;
                    }
                    this.website = this.profile.website;
                    this.address = this.profile.address;
                    this.phone = this.profile.phone;


                })
                .catch(err => {

                });
        },

        //  Gets countries
        getCountries() {
            axios.get('/api/v1/countries')
                .then(response => {
                    this.countries = response.data.data;
                })
                .catch(err => {

                });
        },

        // Gets states
        getStates() {
            axios.get('/api/v1/states/' + this.country_id)
                .then(response => {
                    this.states = response.data.data;
                })
                .catch(err => {

                });
        },

        // Gets lgas
        getLgas() {
            axios.get('/api/v1/lgas/' + this.state_id)
                .then(response => {
                    this.lgas = response.data.data;
                })
                .catch(err => {

                });
        },

        createAdvert() {
            $("#advert-form").LoadingOverlay("show");
            let file = new FormData();
            let files = document.querySelector('#image1').files;
            $.each(files, function (key, value) {
                file.append('image1', value);
            });

            files = document.querySelector('#image2').files;
            $.each(files, function (key, value) {
                file.append('image2', value);
            });

            files = document.querySelector('#image3').files;
            $.each(files, function (key, value) {
                file.append('image3', value);
            });

            files = document.querySelector('#image4').files;
            $.each(files, function (key, value) {
                file.append('image4', value);
            });

            files = document.querySelector('#image5').files;
            $.each(files, function (key, value) {
                file.append('image5', value);
            });

            files = document.querySelector('#image6').files;
            $.each(files, function (key, value) {
                file.append('image6', value);
            });

            let types = this.types;
            let attributes = {};
            // console.log($("#" + this.replaceSpace(types[0].name)));
            for (var i = 0; i < types.length; i++) {
                var name = {};
                if (types[i].form_type == 'select') {
                    name['value'] = [$("#" + this.replaceSpace(types[i].name) + " :selected").val()];
                }

                if (types[i].form_type == 'radio') {
                    name['value'] = [$("#" + this.replaceSpace(types[i].name) + ":checked").val()];
                }

                if (types[i].form_type == 'checkbox') {
                    var temp = $("#" + this.replaceSpace(types[i].name) + ":checked");
                    secondtemp = [];
                    temp.each(function (i) {
                        secondtemp.push($(this).val());
                    });

                    // checks if checkbox array contains any value
                    if (secondtemp.length > 0) {
                        name['value'] = secondtemp;
                    }

                }
                attributes[this.replaceSpace(types[i].name)] = name;

            }
            attributes = JSON.stringify(attributes).replace(new RegExp("\"", 'g'), '\'');
            // console.log(attributes);

            file.append('title', this.title);
            file.append('description', this.description);
            file.append('phone', this.phone);
            file.append('state_id', this.state_id);
            file.append('country_id', this.country_id);
            file.append('lga_id', this.lga_id);
            file.append('category_id', this.category_id);
            file.append('subcategory_id', this.subcategory_id);
            file.append('latitude', this.latitude);
            file.append('longitude', this.longitude);
            file.append('address1', this.address1);
            file.append('price', this.price);
            file.append('phone1', this.phone1);
            file.append('attr', attributes);
            file.append('specifications', JSON.stringify(this.specifications));

            axios.post('/account/advert/create', file)
                .then(response => {
                    $("#advert-form").LoadingOverlay("hide");
                    success('Success', 'Advert Created Successfully');
                    setTimeout(function () { location.href = "/account/dashboard" }, 2000);
                })
                .catch(err => {
                    $("#advert-form").LoadingOverlay("hide");
                    if (err.response.data.response == 422) {
                        error('Oops!', 'Check required fields')
                        this.errors = err.response.data.errors;
                    }
                    if (err.response.data.response == 401) {
                        error('Oops!', err.response.data.message)
                    }
                    if (err.response.data.response == 404) {
                        error('Oops!', err.response.data.message)
                    }
                });

        },

        editAdvert() {
            $("#advert-form").LoadingOverlay("show");
            let file = new FormData();
            let files = document.querySelector('#image1').files;
            $.each(files, function (key, value) {
                file.append('image1', value);
            });

            files = document.querySelector('#image2').files;
            $.each(files, function (key, value) {
                file.append('image2', value);
            });

            files = document.querySelector('#image3').files;
            $.each(files, function (key, value) {
                file.append('image3', value);
            });

            files = document.querySelector('#image4').files;
            $.each(files, function (key, value) {
                file.append('image4', value);
            });

            files = document.querySelector('#image5').files;
            $.each(files, function (key, value) {
                file.append('image5', value);
            });

            files = document.querySelector('#image6').files;
            $.each(files, function (key, value) {
                file.append('image6', value);
            });

            let types = this.types;
            let attributes = {};
            // console.log($("#" + this.replaceSpace(types[0].name)));
            for (var i = 0; i < types.length; i++) {
                var name = {};
                if (types[i].form_type == 'select') {
                    name['value'] = [$("#" + this.replaceSpace(types[i].name) + " :selected").val()];
                }

                // cleans up the name of the type and adds it to object
                if (types[i].form_type == 'radio') {
                    name['value'] = [$("#" + this.replaceSpace(types[i].name) + ":checked").val()];
                }

                if (types[i].form_type == 'checkbox') {
                    var temp = $("#" + this.replaceSpace(types[i].name) + ":checked");
                    secondtemp = [];
                    temp.each(function (i) {
                        secondtemp.push($(this).val());
                    });
                    // checks if checkbox array contains any value
                    if (secondtemp.length > 0) {
                        name['value'] = secondtemp;
                    }

                }

                attributes[this.replaceSpace(types[i].name)] = name;

            }
            attributes = JSON.stringify(attributes).replace(new RegExp("\"", 'g'), '\'');
            // console.log(attributes);

            file.append('title', this.title);
            file.append('description', this.description);
            file.append('phone', this.phone);
            file.append('state_id', this.state_id);
            file.append('country_id', this.country_id);
            file.append('lga_id', this.lga_id);
            file.append('category_id', this.category_id);
            file.append('subcategory_id', this.subcategory_id);
            file.append('latitude', this.latitude);
            file.append('longitude', this.longitude);
            file.append('address1', this.address1);
            file.append('price', this.price);
            file.append('phone1', this.phone1);
            file.append('attr', attributes);
            file.append('specifications', JSON.stringify(this.specifications));
            file.append('_method', 'PATCH');
            axios.post('/account/advert/edit/' + this.advert_edit_id, file)
                .then(response => {
                    $("#advert-form").LoadingOverlay("hide");
                    success('Success', 'Advert Edited Successfully');
                    console.log(response);
                    // setTimeout(function () { location.href = "/account/dashboard" }, 2000);
                })
                .catch(err => {
                    $("#advert-form").LoadingOverlay("hide");
                    if (err.response.data.response == 422) {
                        error('Oops!', 'Check required fields')
                        this.errors = err.response.data.errors;
                    }
                    if (err.response.data.response == 401) {
                        error('Oops!', err.response.data.message)
                    }
                    if (err.response.data.response == 404) {
                        error('Oops!', err.response.data.message)
                    }
                });

        },

        apply() {
            let data = new FormData();
            let files = document.querySelector('#image1').files;
            $.each(files, function (key, value) {
                data.append('business_docs', value);
            });

            data.append('store_name', this.store_name);
            data.append('store_url', this.store_url);
            data.append('store_description', this.store_description);

            axios.post('/account/seller/apply', data)
                .then(response => {
                    success('Success', 'Application Successful');
                    setTimeout(function () { location.href = '/account/dashboard' }, 2000);
                })
                .catch(err => {
                    if (err.response.data.response == 422) {
                        error('Oops!', 'Check required fields')
                        this.errors = err.response.data.errors;
                    }
                    if (err.response.data.response == 401) {
                        error('Oops!', err.response.data.message)
                    }
                    if (err.response.data.response == 404) {
                        error('Oops!', err.response.data.message)
                    }
                });
        },

        replaceSpace(value) {
            return value.replace(" ", "_");
        },

        triggerFile(idname) {

            $("#" + idname).trigger('click');
        },

        readDoc(idname, imgshow) {

            let input = document.querySelector('#' + idname);

            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#' + imgshow).attr('src', '/img/doc.jpg');

                }

                reader.readAsDataURL(input.files[0]);
            }
        },


        readIMG(idname, imgshow) {

            let input = document.querySelector('#' + idname);

            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#' + imgshow).attr('src', e.target.result);
                    $('#' + imgshow).css('max-height', '200px');
                }

                reader.readAsDataURL(input.files[0]);
            }
        }


    }
});

// vapp.config.productionTip = false;
