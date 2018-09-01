
<!DOCTYPE html>
<html lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Message Chat</title>

        <!-- Bootstrap CSS -->
        <!-- <link rel="stylesheet" type="text/css" href="{{asset('css/bootstrap.min.css')}}"> -->
        <link href='https://fonts.googleapis.com/css?family=Bonbon' rel='stylesheet'>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
     
    </head>
    <body>
        <div class="container"  style="text-align: center; display:flex; align-items: center; justify-content: center;">
        <div class="row" style="padding: 35px">
            <div class="col-md-6 col-md-offset-3 text-center" style="border: 1.3px solid #cecece; padding: 0;">
                <br>
                <img src="https://res.cloudinary.com/tribenigeria-com/image/upload/v1531248026/property-logo_leku6t.png" width="150px" height="63px">

                
                <br>
                <h2 style="color: grey"></h2>
                <p style="color: grey; padding: 10px;">
                    <p style="font-size: 16px; padding: 15px;">
                    {{$user->firstname}} {{$user->lastname}} 
                    Sent you a message.
                    </p>
                </p>
                <br>
                    <a href="{{url('account/messages')}}" style="font-family: san-serif; background-color: #00cc67; font-size: 14px; border-radius: 1.4em; text-decoration: none; color: white; padding: 8px; border-width: 1px;box-shadow:  none;border-color:  #00cc67;border-image:  none;">&nbsp;&nbsp;Reply&nbsp;&nbsp;</a>
                
                <br>
                <!-- <p style="color: grey">Thank you for registering on our platform</p> -->
                <br>
                <div style="background-color: #f9f9f9; padding-left: 10px; padding-right: 10px;;">
                    <h3 style="color: grey; font-size: 16px; padding-top: 10px;">Experience the best</h3>
                    
                    <a href="#"><i style="color: grey; font-size: 17px; padding-right: 4px;" class="fa fa-facebook"></i></a>
                    <a href="#"><i style="color: grey; font-size: 17px; padding-right: 4px;" class="fa fa-twitter"></i></a>
                    <a href="#"><i style="color: grey; font-size: 17px; padding-right: 4px;" class="fa fa-instagram"></i></a>
                    <br>
                    <p style="color: grey; font-size: 14px;">
                        P.O.Box 6543 33 Iweka Road Onitsha, Anambra state Nigeria
                    </p>
                    <p style="color: grey;">
                        Visit us at <a style="color: #00cc67" href="{{url('')}}">{{env('APP_NAME')}}</a>
                    </p>
                    <br>
                </div>
            </div>
        </div>
            
        </div>

        <!-- jQuery -->
        <script src="{{asset('js/jquery-min.js')}}"></script>
        <!-- Bootstrap JavaScript -->
        <script src="{{asset('js/bootstrap.min.js')}}"></script>
    </body>
</html>
