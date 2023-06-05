package org.slovenlypolygon.lab3.model.bean;

import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Named;
import org.slovenlypolygon.lab3.model.utils.DataBaseHelper;

import java.io.Serializable;
import java.util.Arrays;

@Named(value = "query")
@SessionScoped
public class SQLQuery implements Serializable {
    private final DataBaseHelper dataBaseHelper = new DataBaseHelper();
    private String query;
    private String answer;

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String executeQuery() {
        String[] commands = query.split(";");
        System.out.println(Arrays.toString(Arrays.stream(commands).filter(x -> !(x.toLowerCase().trim().startsWith("select") || x.equals(""))).toArray()));
        if (Arrays.stream(commands).filter(x -> !(x.toLowerCase().trim().startsWith("select") || x.equals(""))).toArray().length != 0) {
            System.out.println("FORBIDDEN_COMMAND_ERROR");
            answer = "PARSE_ERROR";
            return "app";
        }
        if (!query.toLowerCase().startsWith("select")) {
            System.out.println("FORBIDDEN_COMMAND_ERROR");
            answer = "FORBIDDEN_COMMAND_ERROR";
            return "app";
        } else {
            answer = dataBaseHelper.executeQuery(query);
            if (answer.contains("EXECUTE_ERROR") && !answer.contains("does not exist")) {
                answer = "PARSE_ERROR";
                return "app";
            } else {
                return "query?faces-redirect=true";
            }
        }
    }

    public String getAnswer() {
        return answer;
    }
}
