<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Model\Category;
use App\Model\Advert;
use App\Model\Subtype;
use App\Http\Resources\GenericResource;
use Auth;


class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $adverts = Advert::all();
        $adverts->load('image');
        $categories = Category::all();
        $adverts->each(function ($item, $key){
            $item->encoded_id = $this->encode($item->id);
        });
        // dd($adverts);
        return view('index', compact('adverts', 'categories'));
    }

    public function categories()
    {
        $adverts = Advert::all();
        $adverts->load('image');
        $categories = Category::paginate(8);

        $categories->load('advert.subcategory');
      

        $categories->each(function ($item, $key){
            $item->advert->each(function ($item1, $key1){
                $item1->encoded_id = $this->encode($item1->id);
            });
            
        });
        
        return view('categories', compact('adverts', 'categories'));
    }

    public function categoriesFilter(Request $request)
    {
        $category_id = $request->get('category');
        $adverts = collect([]);
        $category = Category::find($category_id);
        $categories = Category::all();
        if(!is_null($category) ){
            $adverts = $category->advert;
        }

        
        $adverts->each(function ($item, $key){
            $item->encoded_id = $this->encode($item->id);
        });
        
        $cat = $category;
        
        return view('categoriesfilter', compact('adverts', 'categories', 'cat'));
    }


    public function advertDetail(Request $request, $advert_id, $name)
    {
        $advert = Advert::find($this->decode($advert_id));
        if(is_null($advert)){
            return "";
        }
        $raw = str_replace("'","\"",$advert->attributes);
        $decoded = json_decode($raw, true) == null ? [] : json_decode($raw, true);
        
        $specification = [];
        $advert->encoded_id = $advert_id;
        foreach($decoded as $key => $value){
            $temp = Subtype::whereIn('id', $value)->get();
            $specification[$key] = $temp;
            
        }
        
        $advert->load('image','category','subcategory', 'specifications');
        return view('singleadvert', compact('advert', 'specification'));
    }

    public function getAuthUser(){
        return new GenericResource(Auth::user());
    }
}
