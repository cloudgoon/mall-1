package com.igomall.controller.shop;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URL;

@RestController
@RequestMapping("/demo")
public class DemoController extends BaseController {

    @GetMapping("/a")
    public String a() throws Exception{
        parse("http://java.bizpower.com/web/category");
        return "ok";
    }

    public static void parse(String url) throws Exception{
        Document document = Jsoup.parse(new URL(url),5000);
        Element element = document.getElementsByClass("categoryCon").first();
        Elements children = element.children();
        Iterable<Element> iterable = children.iterator();
        //第一级


        //第二级


        //第三级



    }

    public static void main(String[] args) throws Exception {
        parse("http://java.bizpower.com/web/category");
    }
}
