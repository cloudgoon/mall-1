package com.igomall;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.ArrayUtils;

import antlr.StringUtils;

public class Demo {

	public static void main(String[] args) {
		File file = new File("/Users/blackboy/eclipse-workspace/mall1");
		List<File> files = listFiles(file);
		
		for (File file2 : files) {
			if(org.apache.commons.lang3.StringUtils.endsWith(file2.getName(), ".html")) {
				String newFileName = file2.getParent()+"/"+file2.getName().replace(".html", ".html");
				File newFile = new File(newFileName);
				try {
					FileUtils.copyFile(file2, newFile);
					FileUtils.deleteQuietly(file2);
				} catch (IOException e) {
					e.printStackTrace();
				}
				
				System.out.println(newFileName);
			}
		}
		
	}
	
	public static List<File> listFiles(File file) {
		List<File> files = new ArrayList<File>(); 
		if(file.isDirectory()) {
			File[] files1 = file.listFiles();
			for (File file2 : files1) {
				if(file2.isDirectory()) {
					files.addAll(listFiles(file2));
				}else {
					files.add(file2);
				}
			}
		}else {
			files.add(file);
		}
		return files;
	}
	
	
}
