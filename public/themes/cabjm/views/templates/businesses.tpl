<script id="tpl_businesses" type="text/x-handlebars-template">
{{#if businesses}}
    <div class="row justify-content-center">
        {{#each businesses}}
            <div class="col-12 col-md-6 col-lg-4 mb-3 animated zoomIn">
                <a class="card pointer" href="/business/detail?id={{id}}" data-business-id={{id}}>
                    {{#if cover_photo.medium}}
                        <img class="card-img-top img-fluid rounded" src="{{cover_photo.medium}}" alt="{{name}}">
                    {{else}}
                        <img class="card-img-top img-fluid rounded" src="/themes/cabjm/assets/images/nologo.png" alt="{{name}}">
                    {{/if}}
                    <div class="card-block text-layer py-1 px-0">
                        <p class="card-text h5 pl-2 mb-0 text-left text-white">{{name}}</p>
                        <p class="card-text h9 pl-2 text-left text-muted">{{category.name}}</p>
                    </div>
                    <div class="logo-business">
                        <img class="rounded float-right" src="{{logo.thumbnail}}" alt="{{name}}" style="max-width: 100px;">
                    </div>
                </a>
            </div>
        {{/each}}
    </div>
{{else}}
<h1>No Businesses to display</h1>
{{/if}}
</script>