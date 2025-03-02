package vttp.testssfproject2.testssfproject2.config.unused;
import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@Configuration
// @EnableWebSecurity
public class SecurityConfig {
    
    // @Bean
    // public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    //     http
            
    //         .authorizeHttpRequests(auth -> auth
    //             .requestMatchers("/", "/login", "/error","/index", "/webjars" ,"/api/**").permitAll()
    //             .anyRequest().authenticated()
    //         )
    //         .oauth2Login(oauth2 -> oauth2
    //             .loginPage("/login")
    //             .defaultSuccessUrl("/dashboard", true)
    //             .failureUrl("/login?error=true")
    //             .permitAll()
    //         )
    //         .logout(logout -> logout
    //             .logoutUrl("/logout")
    //             .logoutSuccessUrl("/")
    //             .invalidateHttpSession(true)
    //             .deleteCookies("JSESSIONID")
    //             .permitAll()
    //         )
    //         .csrf(csrf -> csrf.disable())
    //         .cors(cors -> cors.disable());

    //     return http.build();
    // }
        // private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);
        // @Bean
        // public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            
        //     http
        //         // Remove .cors() call here; Spring Security will auto-detect your CorsConfigurationSource bean
        //         .authorizeHttpRequests(auth -> auth
        //             .requestMatchers("/", "/login", "/error", "/webjars/**", "/api/public/**").permitAll()
        //             .anyRequest().authenticated()
        //         )
        //         .oauth2Login(oauth2 -> oauth2
        //             .defaultSuccessUrl("http://localhost:4200/dashboard", true)
        //             .failureUrl("http://localhost:4200/login?error=true")
        //             .permitAll()
        //         )
        //         .logout(logout -> logout
        //             .logoutUrl("/logout")
        //             .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.NO_CONTENT))
        //             .invalidateHttpSession(true)
        //             .deleteCookies("JSESSIONID")
        //             .permitAll()
        //         )
        //         .csrf(csrf -> csrf.disable());

        //     return http.build();
        // }
        // @Bean
        // public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        //     http
        //         .cors().and()  // Enable CORS
        //         .csrf().disable()  // Disable CSRF (optional, for testing)
        //         .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
    
        //     return http.build();
        // }


//         @Bean
// public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//     http
//         .authorizeHttpRequests(auth -> auth
//             // .requestMatchers(HttpMethod.GET, "/**").permitAll()
//             // .requestMatchers(HttpMethod.GET, "/**").permitAll()
//             // .requestMatchers(HttpMethod.POST, "/**").permitAll() 
//             .requestMatchers( "/**").permitAll() // Allow OPTIONS requests
//             .requestMatchers("/","/game","/app","/login", "/error", "/webjars/**", "/api/public/**").permitAll()
//             .anyRequest().authenticated()
//         )
//         .oauth2Login(oauth2 -> oauth2
//             .defaultSuccessUrl("http://localhost:4200/dashboard", true)
//             .failureUrl("http://localhost:4200/login?error=true")
//             .permitAll()
            
//         )
//         .logout(logout -> logout
//             .logoutUrl("/logout")
//             .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.NO_CONTENT))
//             .invalidateHttpSession(true)
//             .deleteCookies("JSESSIONID")
//             .permitAll()
//         )
//         .csrf(csrf -> csrf.disable());

//     return http.build();
// }

    
}
