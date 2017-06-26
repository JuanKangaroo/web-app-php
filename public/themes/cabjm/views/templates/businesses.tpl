<script id="tpl_businesses" type="text/x-handlebars-template">
{{#if businesses}}
    {{#ifCond businesses.length '<' 3}}
        <div class="row justify-content-center">
            {{#each businesses}}
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card pointer js-business-detail" data-business-id={{id}}>
                        {{#if cover_photo.medium}}
                            <img class="card-img-top img-fluid rounded" src="{{cover_photo.medium}}" alt="{{name}}">
                        {{else}}
                            <img class="card-img-top img-fluid rounded" src="/themes/cabjm/assets/images/nologo.png" alt="{{name}}">
                        {{/if}}
                        <div class="card-block text-layer py-1 px-0">
                            <p class="card-text h5 pl-2 mb-0 text-left text-white">{{name}}</p>
                            <p class="card-text h9 pl-2 text-left">{{category.name}}</p>
                        </div>
                        <div class="logo-business">
                            <img class="rounded float-right" src="{{logo.thumbnail}}" alt="{{name}}" style="max-width: 100px;">
                        </div>
                    </div>
                </div>
            {{/each}}
        </div>
    {{else}}
        <div class="row justify-content-center">
        {{#each businesses}}
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card pointer js-business-detail" data-business-id={{id}}>
                    {{#if cover_photo.medium}}
                        <img class="card-img-top img-fluid rounded" src="{{cover_photo.medium}}" alt="{{name}}">
                    {{else}}
                        <img class="card-img-top img-fluid rounded" src="/themes/cabjm/assets/images/nologo.png" alt="{{name}}">
                    {{/if}}
                    <div class="card-block text-layer py-1 px-0">
                        <p class="card-text h5 pl-2 mb-0 text-left text-white">{{name}}</p>
                        <p class="card-text h9 pl-2 text-left">{{category.name}}</p>
                    </div>
                    <div class="logo-business">
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