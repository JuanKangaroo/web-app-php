<script id="tpl_coupons" type="text/x-handlebars-template">
<!-- <p class="lead">Businessxx</p> -->

{{#if offers}}
    {{#ifCond offers.length '<' 3}}
        <div class="row justify-content-center">
            {{#each offers}}
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card js-coupon-detail" data-coupon-id={{id}} style="border: none; cursor: pointer;">
                        {{#if images.path}}
                            <img class="card-img-top img-fluid" src="{{images.path}}" alt="{{name}}">
                        {{else}}
                            <img class="card-img-top img-fluid" src="/themes/cabjm/assets/images/nologo.png" alt="{{name}}">
                        {{/if}}
                        <div class="card-block py-1 px-0">
                            <p class="card-text mb-0 text-left h5">{{title}}</p>
                            <p class="card-text text-left h7">{{../coalition.name}}</p>
                        </div>
                    </div>
                </div>
            {{/each}}
        </div>
    {{else}}
        <div class="row">
        {{#each offers}}
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card" style="border: none;">
                    {{#if images.path}}
                        <img class="card-img-top img-fluid" src="{{images.path}}" alt="{{name}}">
                    {{else}}
                        <img class="card-img-top img-fluid" src="/themes/cabjm/assets/images/nologo.png" alt="{{name}}">
                    {{/if}}
                    <div class="card-block py-1 px-0">
                        <p class="card-text mb-0 text-left h5">{{title}}</p>
                        <p class="card-text text-left h7">{{../coalition.name}}</p>
                    </div>
                </div>
            </div>
        {{/each}}
        </div>
    {{/ifCond}}
{{else}}
<h1>No Coupons to display</h1>
{{/if}}
</script>