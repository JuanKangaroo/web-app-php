<div class="container-fluid pt-3">
    <div class="row">
        <div class="col-12">
            <div id="rewards__list"></div>
        </div>
    </div>
</div>

<div class="modal fade" id="rewardsRedemptionConfirmModal" tabindex="-1" role="dialog" aria-labelledby="redeemModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="redeemModalLabel">Redeem Confirmation</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body text-center">
                <p>You are about to redeem:</p>
                <p class="lead" id="reward_title">&nbsp;</p>
                <p>Are you sure ?</p>
            </div>
            <div class="modal-footer align-self-center">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">No, Cancel</button>
                <button type="button" class="btn btn-primary js-redeem__confirm-btn">Yes, Redeem</button>
            </div>
        </div>
    </div>
</div>