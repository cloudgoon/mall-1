package com.igomall.util;

import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.sql.DataSource;

import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.MapListHandler;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

public class DbUtils {
    private static DataSource datasource;

    public static DataSource getDataSource() {
        if (datasource == null) {
            InputStream in = DbUtils.class.getClassLoader().getResourceAsStream("shopxx.properties");
            Properties prop = new Properties();
            try{
                prop.load(in);
            }catch (Exception e){
                e.printStackTrace();
            }finally {
                if(in!=null){
                    try {
                        in.close();
                    }catch (Exception e){
                        e.printStackTrace();
                    }
                }
            }
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(prop.getProperty("jdbc.url"));
            config.setDriverClassName(prop.getProperty("jdbc.driver"));
            config.setUsername(prop.getProperty("jdbc.username"));
            config.setPassword(prop.getProperty("jdbc.password"));
            config.setMaximumPoolSize(10);
            config.setAutoCommit(false);
            config.addDataSourceProperty("cachePrepStmts", "true");
            config.addDataSourceProperty("prepStmtCacheSize", "250");
            config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
            datasource = new HikariDataSource(config);
        }
        return datasource;
    }

    public static List<Map<String,Object>> list(String sql, Object... params){
        QueryRunner qr = new QueryRunner(getDataSource());
        try{
            return qr.query(sql, new MapListHandler(),params);
        }catch (Exception e){
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

}
