toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "2500",
    "hideDuration": "2500",
    "timeOut": "1000",
    "extendedTimeOut": "500",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

let AccountService = {
    initFormValidation : function(formId){
        $(formId).validate({
            rules: {
                name: {
                    required: true
                },
                email: {
                    required: true
                },
                password: {
                    required: true,
                    strongPassword: true,
                    maxlength: 20
                }
            },
            messages: {
                name: {
                    required: "Please enter your name"
                },
                email: {
                    required: "Please enter your email"
                },
                  password: {
                    required: "Please enter your password",
                    maxlength: "Your password cannot be longer than 20 characters"
                  }
            },
            submitHandler: function (form) {
                try {
                    $.blockUI({ message: '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>'});
                    let formData = new FormData(form);
                    let entity = {};
                    formData.forEach(function(value, key) {
                        entity[key] = value;
                    });
                    AccountService.login(entity);
                    $.unblockUI();

                } catch (error) {
                    console.error('Error in submitHandler:', error);
                    alert('An error occurred. Please try again later.');
                    $.unblockUI()
                }
            }
        });
    },

    login : function(user){

        RestClient.get('users.json', function(data){
            let found = false;
                data.forEach(element => {
                    if (element.name == user.name && element.email == user.email && element.password == user.password) {
                        localStorage.setItem('user', JSON.stringify(user));
                        found = true;
                    }
                });
                if (!found) {
                    setTimeout(function(){toastr.error("Invalid credentials");}, 1000)
                }else {
                    setTimeout(function(){
                        toastr.success('You signed in successfully!');
                        AccountService.showProfilePage();
                    }, 2000)
                }
        }, function(error){
            console.error("Error fetching data from file", error);
        })
    },

    showProfilePage : function(){
        const username = document.getElementById('name').value;
        document.getElementById('sign-up-section').classList.add('hidden');
        document.getElementById('profile-section').classList.remove('hidden');
        document.getElementById('profile-name').innerText = username;
            
        let logoutButton = document.getElementById('logout-button');
        if (!logoutButton.hasAttribute('data-event-listeners-attached')) {
            logoutButton.addEventListener('click', function() {
                document.getElementById('profile-section').classList.add('hidden');
                document.getElementById('sign-up-section').classList.remove('hidden');
                toastr.info('You are signed out!');
                document.getElementById('profile-name').value = '';
                document.getElementById('login-form').reset();
            });
            logoutButton.setAttribute('data-event-listeners-attached', 'true');
        }
    },

    editProfile : function(){
        let editProfileBtn = document.getElementById('edit-profile-btn');
        editProfileBtn.addEventListener('click', function(){
            AccountService.openEditModal();
        });
        document.getElementById('close-edit-modal').addEventListener('click', function(){
            $('#editModal').modal('hide');
        });
        document.getElementById('save-changes').addEventListener('click', function(){
            toastr.success('Changes saved successfully!');
            $('#editModal').modal('hide');
        })
    },

    openEditModal: function(){
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser) {
            document.getElementById('edit-name').value = currentUser.name;
            document.getElementById('edit-email').value = currentUser.email;
            document.getElementById('edit-password').value = currentUser.password;
            $('#editModal').modal('show');
        }
    }
}