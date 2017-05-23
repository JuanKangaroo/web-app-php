<script id="tpl_businesses" type="text/x-handlebars-template">
<p class="lead">My Points Balance</p>
<p class="display-4 mb-5">{{formatNumber balance.points}}</p>

{{#if businesses}}
    <div class="row">
    {{#each businesses}}
        <div class="col-12 col-md-4">
            <div class="card" style="border: none;">
                <img class="card-img-top img-fluid mx-auto" src="{{logo}}" alt="{{name}}" style="max-width: 100px;">
                <div class="card-block">
                    <h4 class="card-title">{{formatNumber balance.points}} points</h4>
                </div>
            </div>
        </div>
    {{/each}}
    </div>
{{else}}
<h1>No Businesses to display</h1>
{{/if}}
</script>