<form class="form" id="userProfileForm">
        <div class="row">
            <div class="col-12 col-md-6">

                <div class="form-group">
                    <input type="text" name="first_name" class="form-control form-control-lg" value="{{first_name}}" placeholder="First Name" autofocus="">
                </div>
                <div class="form-group">
                    <input type="text" name="last_name" class="form-control form-control-lg" value="{{last_name}}" placeholder="Last Name" autofocus="">
                </div>
                <div class="form-group">
                    <input id="email" type="email" class="form-control form-control-lg" name="email" value="{{email}}" placeholder="E-Mail Address" required="">
                </div>
                <div class="form-group">
                    <input id="phone" type="phone" class="form-control form-control-lg" name="phone" value="{{phone}}" placeholder="Phone Number">
                    <input id="userPhoneCountryCode" type="hidden" name="country_code" value="{{country_code}}">
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="form-group">
                    <select class="form-control form-control-lg" name="gender">
                        <option value="" {{selected gender}}>Gender</option>
                        <option value="male" {{selected gender 'male'}}>Male</option>
                        <option value="female" {{selected gender 'female'}}>Female</option>
                    </select>
                </div>
                <div class="form-group">
                    <select class="form-control form-control-lg" name="language">
                        <option value="" {{selected language }}>Language</option>
                        <option value="en" {{selected language 'en'}}>English</option>
                        <option value="fr" {{selected language 'fr'}}>French</option>
                        <option value="es" {{selected language 'es'}}>Spanish</option>
                    </select>
                </div>
                <div class="form-group">
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