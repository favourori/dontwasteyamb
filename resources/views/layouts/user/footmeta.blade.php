<script data-cfasync="false" src="../../cdn-cgi/scripts/f2bf09f8/cloudflare-static/email-decode.min.js')}}"></script>
    <script src="{{asset('js/jquery-min.js')}}"></script>
    <script src="{{asset('js/popper.min.js')}}"></script>
    <script src="{{asset('js/bootstrap.min.js')}}"></script>
    <!-- <script src="{{asset('js/color-switcher.js')}}"></script> -->
    <script src="{{asset('js/jquery.counterup.min.js')}}"></script>
    <script src="{{asset('js/waypoints.min.js')}}"></script>
    <script src="{{asset('js/wow.js')}}"></script>
    <script src="{{asset('js/owl.carousel.min.js')}}"></script>
    <script src="{{asset('js/nivo-lightbox.js')}}"></script>
    <script src="{{asset('js/jquery.slicknav.js')}}"></script>
    <script src="{{asset('js/main.js')}}"></script>
    <script src="{{asset('js/map.js')}}"></script>
    <script src="https://maps.googleapis.com/maps/api/js?radius=100&key=AIzaSyBCtk1wRKll07gVjp_AU76DBKts6jbrnyA&libraries=places&callback=initAutocomplete" async defer></script>
    <script src="{{asset('js/form-validator.min.js')}}"></script>
    <script src="{{asset('js/contact-form-script.min.js')}}"></script>
    <script src="{{asset('js/summernote.js')}}"></script>
    <script src="{{asset('js/iziToast.js')}}"></script>
    <script src="{{asset('js/iziwrapper.js')}}"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.js"></script>
    <script src="{{asset('js/root.js')}}?version={{md5(date('H:i:s'))}}"></script>

     @if(Session::has('success'))   
            <script>
            success('Good', "{{Session::get('success')}}")
            </script>
        @endif

        @if(Session::has('error'))
        <script>
            error('Oops!', "{{Session::get('error')}}")
        </script>
        @endif