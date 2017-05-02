<script id="tpl_login" type="text/x-handlebars-template">
    <div class="container-fluid pt-3">
        {{#if profile}}
            <div class="row">
                <div class="col-12 col-md-6 col-lg-4">
                    <form class="form">
                        <div class="form-group">
                            <input type="text" name="first_name" class="form-control form-control-lg" value="{{profile.first_name}}" placeholder="First Name" autofocus="">
                        </div>
                        <div class="form-group">
                            <input type="text" name="last_name" class="form-control form-control-lg" value="{{profile.last_name}}" placeholder="Last Name" autofocus="">
                        </div>
                        <div class="form-group">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-envelope-o fa-fw" aria-hidden="true"></i></span>
                                <input id="email" type="email" class="form-control form-control-lg" name="email" value="{{profile.email}}" placeholder="E-Mail Address" required="">
                            </div>
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary btn-block btn-lg" > Save </button>
                        </div>
                    </form>
                </div>
            </div>
        {{else}}
            <h1>Unknown User</h1>
        {{/if}}
        
    </div>
</script>