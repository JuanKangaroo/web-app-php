<script id="tpl_coupon_detail" type="text/x-handlebars-template">
    <div class="row justify-content-center">
        <div class="col-12 col-md-6">
            <div class="row justify-content-center">
                {{#if images.0.path}}
                    <img class="card-img-top img-fluid" src="{{images.0.path}}" alt="{{title}}">
                {{else}}
                    <img class="card-img-top img-fluid" src="/themes/cabjm/assets/images/nologo.png" alt="{{title}}">
                {{/if}}
            </div>
            <div class="card-block py-1 px-0">
                <p class="card-text mb-0 text-left h5">{{title}}</p>
                <p class="card-text text-left h7">{{branch_name}}</p>
                <p class="card-text mb-0 text-left h7">{{description}}</p>
            </div>
        </div>
    </div>
</script>