package com.igomall.util;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.File;
import java.net.URL;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

public class Demo1 {

	public static Set<String> urls = new HashSet<>();



	public static void main(String[] args) throws Exception {
		parse("http://java.bizpower.com/web/category",0);
	}

	public static void parse(String url,Integer index) throws Exception{
		Document document = Jsoup.parse(new URL(url),5000);
		downloadCss(document);
		downloadJs(document);
		if(index<0){
			System.out.println("=========================================================================================================================================================================================="+index);
			downloadA(document,index);
		}

	}

	public static void downloadCss(Document document) throws Exception{
		Elements elements = document.getElementsByTag("link");
		Iterator<Element> iterator = elements.iterator();
		while (iterator.hasNext()){
			Element element = iterator.next();
			String url = element.attr("href");
			System.out.println(url);
			download(url);
		}
	}

	public static void downloadA(Document document,Integer index) throws Exception{
		Elements elements = document.getElementsByTag("a");
		Iterator<Element> iterator = elements.iterator();
		while (iterator.hasNext()){
			Element element = iterator.next();
			String url = element.attr("href");
			if(StringUtils.startsWithIgnoreCase(url,"http")){
				parse(url,++index);
			}

		}
	}


	public static void downloadJs(Document document) throws Exception{
		Elements elements = document.getElementsByTag("script");
		Iterator<Element> iterator = elements.iterator();
		while (iterator.hasNext()){
			Element element = iterator.next();
			String url = element.attr("src");
			System.out.println(url);
			download(url);
		}
	}

	public static void download(String path) throws Exception{
		if(!StringUtils.startsWithIgnoreCase(path,"http")||StringUtils.indexOf(path,".php")>0){
			return;
		}
		System.out.println("download:"+path);
		try{
			URL url = new URL(path);
			path = path
					.replaceAll("http://publicjava.bizpower.com","publicjava")
					.replaceAll("http://staticjava.bizpower.com","staticjava")
					.replaceAll("http://s13.cnzz.com","s13")
					.replaceAll("http://java.bizpower.com","java")
					.replaceAll("http://www.shopnc.net","www");
			if(!urls.contains(path)){
				System.out.println("============================================================================下载");
				File destFile = new File("E:/project-workspace/me/mall/WebContent/resources/asserts/"+path);
				System.out.println(destFile.getAbsolutePath());
				File destDir = destFile.getParentFile();
				if (destDir != null) {
					destDir.mkdirs();
				}

				FileUtils.copyInputStreamToFile(url.openStream(),destFile);
				urls.add(path);
			}else {
				System.out.println("==============================================================================================================已存在");
			}

		}catch (Exception e){
			e.printStackTrace();
		}
	}
	
}
