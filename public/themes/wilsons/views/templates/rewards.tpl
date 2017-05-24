<script id="tpl_rewards" type="text/x-handlebars-template">
{{#if catalog_items}}
    <div class="row mt-3">
    {{#each catalog_items}}
    <div class="col-12 col-md-3 col-lg-4">
        <div class="row" data-toggle="modal" data-target="#rewardsRedemptionConfirmModal" 
            data-reward-id={{id}} data-reward-title="{{title}}" data-is-tpr="{{partner_reward}}" >
            <div class="col-9">
                <div class="card" style="border: none;">
                    <img class="card-img-top img-fluid" src="{{images.0.path}}" alt="{{title}}">
                    <div class="card-block py-1 px-0">
                        <p class="card-text">{{title}}</p>
                    </div>
                </div>
            </div>
            <div class="col-3">
                <p>{{points}} points</p>
            </div>
        </div>
    </div>
    {{/each}}
    </div>
{{else}}
<h1>No Rewards to display</h1>
{{/if}}
</script>