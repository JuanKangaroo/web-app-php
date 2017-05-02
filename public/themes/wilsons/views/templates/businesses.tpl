<script id="tpl_businesses" type="text/x-handlebars-template">
{{#if businesses}}
    {{#each businesses}}
    <div class="row">
        <div class="col-4">
            <img src="{{logo}}" class="img-fluid">
        </div>
        <div class="col-8">
            <p class="lead">{{name}}</p>
            <p>{{about}}</p>
            
        </div>
    </div>
    {{/each}}
{{else}}
<h1>No Businesses to display</h1>
{{/if}}
</script>