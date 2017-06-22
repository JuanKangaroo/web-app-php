<script id="tpl_businesses" type="text/x-handlebars-template">
<!-- <p class="lead">Business</p> -->
<!-- <p class="display-4 mb-5">{{formatNumber balance.points}}</p> -->

{{#if businesses}}
    {{#ifCond businesses.length '<' 3}}
        <div class="row justify-content-center">
            {{#each businesses}}
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card js-business-detail" data-business-id={{id}} style="border: none; cursor: pointer;">
                        {{#if cover_photo.medium}}
                            <img class="card-img-top img-fluid" src="{{cover_photo.medium}}" alt="{{name}}">
                        {{else}}
                            <img class="card-img-top img-fluid" src="/themes/cabjm/assets/images/nologo.png" alt="{{name}}">
                        {{/if}}
                        <div class="card-block py-1 px-0">
                            <p class="card-text mb-0 text-left h5">{{name}}</p>
                            <p class="card-text text-left h7">{{category.name}}</p>
                        </div>
                        <div style="position: absolute; right: 10px; bottom: 50px;">
                            <img class="rounded float-right" src="{{logo.thumbnail}}" alt="{{name}}" style="max-width: 100px;">
                        </div>
                    </div>
                </div>
            {{/each}}
        </div>
    {{else}}
        <div class="row">
        {{#each businesses}}
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card" style="border: none;">
                    {{#if cover_photo.medium}}
                        <img class="card-img-top img-fluid" src="{{cover_photo.medium}}" alt="{{name}}">
                    {{else}}
                        <img class="card-img-top img-fluid" src="/themes/cabjm/assets/images/nologo.png" alt="{{name}}">
                    {{/if}}
                    <div class="card-block py-1 px-0">
                        <p class="card-text mb-0 text-left h5">{{name}}</p>
                        <p class="card-text text-left h7">{{category.name}}</p>
                    </div>
                    <div style="position: absolute; right: 10px; bottom: 50px;">
                        <img class="rounded float-right" src="{{logo.thumbnail}}" alt="{{name}}" style="max-width: 100px;">
                    </div>
                </div>
            </div>
        {{/each}}
        </div>
    {{/ifCond}}
{{else}}
<h1>No Businesses to display</h1>
{{/if}}
</script>