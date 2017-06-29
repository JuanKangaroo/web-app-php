<script id="tpl_business_detail" type="text/x-handlebars-template">

<div class="row justify-content-center">
    <div class="col-12">
        <h4 class="text-white text-center">{{data.name}}</h4>
    </div>
</div>

<div class="row justify-content-center">
    <div class="col-12">
        {{#if included.offers}}
            <div class="mt-5 container-wrapper pl-2 pr-2" >
                <h5 class="text-center text-muted mt-2 mb-4">COUPONS YOU MAY LIKE</h5>
                <div class="row justify-content-center">
                    {{#each included.offers}}
                        <div class="col-12 col-md-6 col-lg-4 mb-3">
                            <div class="card pointer js-coupon-detail" data-coupon-id={{id}}>
                                {{#if images.0.medium}}
                                    <img class="card-img-top img-fluid rounded" src="{{images.0.medium}}" alt="{{name}}">
                                {{else}}
                                    <img class="card-img-top img-fluid rounded" src="/themes/cabjm/assets/images/nologo.png" alt="{{name}}">
                                {{/if}}
                                <div class="card-block text-layer py-1 px-0">
                                    <p class="card-text h6 mt-1 mb-1 text-center text-white">{{title}}</p>
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
            </div>
        {{/if}}
    </div>
</div>

<div class="row justify-content-center">
    <div class="col-12">
        <div class="mt-2 container-wrapper justify-content-center" >
            <h5 class="text-center text-muted mt-2 mb-4">WHO WE ARE</h5>
            <div class="lead text-left text-white ml-3 mr-3 mb-3">{{data.about}}</div>
            <div class="row justify-content-center ml-2 mr-2 mb-3">
                <div id="map-canvas" class="map-container"></div>
            </div>
        </div>
    </div>
</div>
</script>