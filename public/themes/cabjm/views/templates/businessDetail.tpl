<script id="tpl_business_detail" type="text/x-handlebars-template">

<div class="row justify-content-center">
    <div class="col-12">
        <h4 class="text-white text-center">{{name}}</h4>
    </div>
</div>

<div class="row justify-content-center">
    <div class="col-12">
        {{#if offers}}
            <div class="mt-5 container-wrapper pl-2 pr-2" >
                <h5 class="text-center text-muted mt-2 mb-4">COUPONS YOU MAY LIKE</h5>
                <div class="row justify-content-center">
                    {{#each offers}}
                        <div class="col-12 col-md-6 col-lg-4 mb-3">
                            <div class="card pointer js-coupon-detail" data-coupon-id={{id}}>
                                {{#if images.path}}
                                    <img class="card-img-top img-fluid rounded" src="{{images.path}}" alt="{{name}}">
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
        {{#if about}}
            <div class="mt-2 container-wrapper justify-content-center" >
                <h5 class="text-center text-muted mt-2 mb-4">WHO WE ARE</h5>
                <h6 class="text-left text-white ml-3 mr-3 mb-3">{{about}}</h6>
                <div class="row justify-content-center ml-2 mr-2 mb-3">
                    <div id="map-canvas" class="map-container"></div>
                </div>
            </div>
        {{/if}}
    </div>
</div>
</script>