<script id="tpl_coupons" type="text/x-handlebars-template">
<!-- <p class="lead">Businessxx</p> -->

{{#if offers}}
    <div class="row justify-content-center">
        {{#each offers}}
            <div class="col-12 col-md-6 col-lg-4 mb-3 animated fadeIn">
                <div class="card pointer js-coupon-detail" data-coupon-id={{id}}>
                    {{#if images.0.medium}}
                        <img class="card-img-top img-fluid rounded" src="{{images.0.medium}}" alt="{{name}}">
                    {{else}}
                        <img class="card-img-top img-fluid rounded" src="/themes/cabjm/assets/images/nologo.png" alt="{{name}}">
                    {{/if}}
                    <div class="card-block text-layer py-1 px-0">
                        <p class="card-text h5 pl-2 mb-0 text-left text-white">{{title}}</p>
                        <p class="card-text h9 pl-2 text-left">{{branch_name}}</p>
                    </div>
                    <div class="logo-business-coupons">
                        <img class="rounded float-right" src="{{branch.logo.thumbnail}}" alt="{{branch.name}}" style="max-width: 100px;">
                    </div>
                    <div class="offer_triangle__container">
                        <div class="offer_triangle__segment">
                            <div class="offer_triangle__content">
                                <div class="offer_triangle__content_text">
                                    {{offerLabel this}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {{/each}}
    </div>
{{else}}
<h1>No Coupons to display</h1>
{{/if}}
</script>