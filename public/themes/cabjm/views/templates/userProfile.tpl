<script id="tpl_userProfile" type="text/x-handlebars-template">
    <form class="form" id="userProfileForm">
        <div class="row">
            <div class="col-12 col-md-6">

                <div class="form-group mt-2">
                    <div id="userProfileContainer" class="user-profile-container">
                        {{#if profile_photo}}
                            <image id="userProfileImage" src="{{profile_photo}}" />
                        {{else}}
                            <image id="userProfileImage" src="http://lorempixel.com/150/150" />
                        {{/if}}
                        
                        <input id="userProfileImageHidden" type="hidden" name="profile_photo" value="{{profile_photo}}">
                    </div>
                    <input id="profileImageUpload" type="file"
                        placeholder="Photo" required="" capture
                        style="display: none;" 
                    >
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" type="email" class="form-control form-control-lg" name="email" value="{{email}}" placeholder="john@example.com" required="">
                </div>
                <div class="form-group">
                    <label for="phone">Cell #</label>
                    <input id="userPhone" type="phone" class="form-control form-control-lg" name="phone" value="{{phone}}" placeholder="220-123-4567">
                    <input id="userPhoneCountryCode" type="hidden" name="country_code" value="{{country_code}}">
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="row">
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="first_name">Last name</label>
                            <input type="text" name="first_name" class="form-control form-control-lg" value="{{first_name}}" placeholder="John" autofocus="">
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-group">
                            <label for="last_name">First name</label>
                            <input type="text" name="last_name" class="form-control form-control-lg" value="{{last_name}}" placeholder="Doe" autofocus="">
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="gender">Gender</label>
                    <select class="form-control form-control-lg" name="gender">
                        <option value="" {{selected gender}}>Gender</option>
                        <option value="male" {{selected gender 'male'}}>Male</option>
                        <option value="female" {{selected gender 'female'}}>Female</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="language">Language</label>
                    <select class="form-control form-control-lg" name="language">
                        <option value="" {{selected language }}>Language</option>
                        <option value="en" {{selected language 'en'}}>English</option>
                        <option value="fr" {{selected language 'fr'}}>French</option>
                        <option value="es" {{selected language 'es'}}>Spanish</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="userBirthDate">Date or birth</label>
                    <input id="userBirthDate" type="text" class="form-control form-control-lg" name="birth_date" value="{{birth_date}}" placeholder="Date of Birth">
                </div>
            </div>
        </div> <!-- row -->
    </form>

    <div class="row">
        <div class="col-4 col-sm-8 pr-0 text-right">
            <div class="form-group">
                <button class="btn btn-default btn-lg" id="userProfileCancel"> Cancel </button>
            </div>
        </div>
        <div class="col-8 col-sm-4 text-right">
            <div class="form-group">
                <button class="btn btn-primary btn-lg btn-block px-1" id="userProfileSave"> Save </button>
            </div>
        </div>
    </div>
</script>