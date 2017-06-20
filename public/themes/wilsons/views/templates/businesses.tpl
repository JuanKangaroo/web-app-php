<script id="tpl_businesses" type="text/x-handlebars-template">
<p class="lead">My Points Balance</p>
<p class="display-4 mb-5">{{formatNumber balance.points}}</p>

{{#if businesses}}
    {{#ifCond businesses.length '<' 3}}
        <div class="row justify-content-center">
            {{#each businesses}}
                <div class="col-12 col-md-3">
                    <div class="card mb-3" style="border: none;">
                        <img class="card-img-top img-fluid mx-auto" src="{{logo.large}}" alt="{{name}}" style="max-width: 200px;">
                    </div>
                </div>
            {{/each}}
        </div>
    {{else}}
        <div class="row">
        {{#each businesses}}
            <div class="col-12 col-md-4">
                <div class="card mb-3" style="border: none;">
                    <img class="card-img-top img-fluid mx-auto" src="{{logo.large}}" alt="{{name}}" style="max-width: 200px;">
                    <!-- <div class="card-block">
                        <h4 class="card-title">{{formatNumber balance.points}} points</h4>
                    </div> -->
                </div>
            </div>
        {{/each}}
        </div>
    {{/ifCond}}
{{else}}
<h1>No Businesses to display</h1>
{{/if}}
</script>