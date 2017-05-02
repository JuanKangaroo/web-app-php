<?php $this->title =  'Error: Page Not Found'; ?>
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css">
<style type="text/css">
    .error-page-options {
        width: 250px;
        margin: 20px auto;
        font-size: 18px;
        padding-left: 35px;
        text-align: left;
        color: #54c1e2;
    }
    .container__error{
        text-align: center;
        padding: 5em 1em;
        color: #9fa1a1;
        box-sizing: border-box;
        max-width: 800px;
        min-width: 320px;
        width: 100%;
        z-index: 2;
    }
    .fa-exclamation-triangle {
        color: #ea581d;
    }
</style>
<div class="container container__error text-center">
    <div class="row justify-content-md-center">
        <?php if ($code == 404): ?>
            <i class="fa fa-exclamation-triangle fa-3x"></i> 
            <h1> Sorry, we couldn't find that page</h1>
            <h2>We can't get you there, but here are some options that might help you get back on track:</h2>
        <?php elseif ($code == 403): ?>
            <h1><i class="fa fa-exclamation-triangle fa-2x"></i> Access forbidden!</h1>
            <h2>You don't have permission to access the requested page.</h2>
        <?php else: ?>
            <h1><i class="fa fa-exclamation-triangle fa-2x"></i> Server error!</h1>
            <h2>The server encountered an internal error and was unable to complete your request.</h2>
        <?php endif ?>
        
    	<!-- <div class="error">
    		<?php //echo CHtml::encode($message); ?>
    	</div> -->
        <div class="error-page-options">
            <div><i class="fa fa-home"></i> <a href="/">Go to the Homepage</a>
            <div><i class="fa fa-home"></i> <a href="/contact-us">Contact Support</a>
        </div>
    </div>
</div>
