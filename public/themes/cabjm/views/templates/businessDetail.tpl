<script id="tpl_business_detail" type="text/x-handlebars-template">

<div class="row justify-content-center">
    <div class="col-12">
        <div class="row justify-content-center">
            <h2>{{name}}</h2>
        </div>
    </div>
</div>

<div class="row justify-content-center">
    <div class="col-12">
        {{#if offers}}
            <div class="mt-5 container-wrapper pl-2 pr-2" >
                <h4 class="text-center text-white">COUPONS YOU MAY LIKE</h4>
                <ul class="pl-0" style="max-width: 320px; margin: auto;">
                {{#each offers}}
                    <li>
                    <div class="card js-coupon-detail" data-coupon-id={{id}}>
                        {{#if images.path}}
                            <img class="card-img-top img-fluid" src="{{images.path}}" alt="{{name}}">
                        {{else}}
                            <img class="card-img-top img-fluid" src="/themes/cabjm/assets/images/nologo.png" alt="{{name}}">
                        {{/if}}
                        <div class="card-block py-1 px-0">
                            <p class="card-text mb-0 text-left h5">{{title}}</p>
                        </div>
                    </div>
                    </li>
                {{/each}}
                </ul>
            </div>
        {{/if}}
    </div>
</div>

<div class="row justify-content-center">
    <div class="col-12">
        {{#if about}}
            <div class="mt-2 container-wrapper justify-content-center" >
                <h4 class="text-center text-white">WHO WE ARE</h4>
                <ul class="icons align-left text-white">
                    <li style="display: block; width: 100%;">
                        <h6>{{about}}</h6>
                        <!-- <div id="map-canvas" class="map-container"></div> --> <!-- data-business-id="{{../../branches}}" -->
                    </li>
                </ul>
            </div>
        {{/if}}
    </div>
</div>


</script>