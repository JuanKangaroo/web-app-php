<script id="tpl_coupon_detail" type="text/x-handlebars-template">
    <div class="row justify-content-center">
        <div class="col-12 col-md-6">
            <div class="row justify-content-center">
                <div class="w-100" style="position: relative;">
                    {{#if images.0.medium}}
                        <img class="card-img-top img-fluid" src="{{images.0.medium}}" alt="{{title}}" style="width: 100%;">
                    {{else}}
                        <img class="card-img-top img-fluid" src="/themes/cabjm/assets/images/nologo.png" alt="{{title}}" style="width: 100%;">
                    {{/if}}
                    <div class="logo-business offer-details">
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
            <div class="card-block py-1 px-0 mt-3">
                <p class="card-text mb-1 text-left h5">{{title}}</p>
                <p class="card-text mb-4 text-left h7">{{branch_name}}</p>
                <p class="card-text mb-0 text-left h7">{{description}}</p>
            </div>
        </div>
    </div>
</script>