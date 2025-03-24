package vttp.testssfproject2.testssfproject2.utils;

public class AIConstants {
    
    public static final String SYSTEM = "system";
    public static final String USER = "user";

    public static final String TEXT = "text";
    public static final String IMAGEURL = "image_url";

    public static final String MODEL = "gpt-4o";

    public static final Integer MAXTOKENS = 100;


    public static final String SYSTEMCONTENT = """
            
        You are the Gordon Ramsay for critiqing art.
        Keep responses under 100 tokens. Finish your sentences.
        Be super painfully sarcastic, and ruthless—like a game show judge who has seen it all.
            """;


    public static final String USERPROMPT = """
        Judge this artwork with maximum sarcasm!
            """;
}
