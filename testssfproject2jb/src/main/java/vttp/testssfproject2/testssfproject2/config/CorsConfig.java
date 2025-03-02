package vttp.testssfproject2.testssfproject2.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    // @Bean
    // public WebMvcConfigurer corsConfigurer() {
    //     return new WebMvcConfigurer() {
    //         @Override
    //         public void addCorsMappings(CorsRegistry registry) {
    //             registry.addMapping("/**") // ✅ Allow API calls
    //                     .allowedOrigins("http://localhost:4200") // ✅ Allow Angular dev server
    //                     .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
    //                     .allowCredentials(true)
    //                     .allowedHeaders("*");
                
    //             // registry.addMapping("/logout") // ✅ Allow logout requests
    //             //         .allowedOrigins("http://localhost:4200")
    //             //         .allowedMethods("POST","OPTIONS")
    //             //         .allowCredentials(true)
    //             //         .allowedHeaders("*");
    //         }
    //     };
    // }
    //  @Bean
    // public CorsFilter corsFilter() {
    //     final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    //     final CorsConfiguration config = new CorsConfiguration();
    //     config.setAllowCredentials(true);
    //     config.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));
    //     config.setAllowedHeaders(Arrays.asList(
    //             HttpHeaders.ORIGIN,
    //             HttpHeaders.CONTENT_TYPE,
    //             HttpHeaders.ACCEPT,
    //             HttpHeaders.AUTHORIZATION
    //     ));
    //     config.setAllowedMethods(Arrays.asList(
    //             "GET",
    //             "POST",
    //             "DELETE",
    //             "PUT",
    //             "PATCH",
    //             "OPTIONS"
    //     ));
    //     source.registerCorsConfiguration("/**", config);
    //     return new CorsFilter(source);

    // @Bean
    // public CorsFilter corsFilter() {
    //     final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    //     final CorsConfiguration config = new CorsConfiguration();
    //     config.setAllowCredentials(true); // Allow credentials (cookies, authorization headers)
    //     config.setAllowedOrigins(Collections.singletonList("http://localhost:4200")); // Allow requests from Angular app
    //     config.setAllowedHeaders(Arrays.asList(
    //             "Origin", "Content-Type", "Accept", "Authorization" // Allow these headers
    //     ));
    //     config.setAllowedMethods(Arrays.asList(
    //             "GET", "POST", "PUT", "DELETE", "OPTIONS" // Allow these HTTP methods
    //     ));
    //     source.registerCorsConfiguration("/**", config); // Apply CORS configuration to all endpoints
    //     return new CorsFilter(source);
    // }

    

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    
}
