using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SkincareBookingService.BLL.DTOs.EmailDTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.BLL.Services;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;
using SkincareBookingService.DAL.Repositories;
using System.Text;

namespace SkincareBookingService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Secret key from appsettings.json
            var jwtKey = builder.Configuration["Jwt:Key"];

            // JwtService -> Secret Key
            builder.Services.AddScoped<IJwtService>(_ => new JwtService(jwtKey));

            builder.Services
                .AddAuthentication(options =>
                {
                    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
                })
                .AddCookie(options =>
                {
                    options.Cookie.HttpOnly = true;
                    options.Cookie.SameSite = SameSiteMode.Lax;
                    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;

                    // Add these lines for better state handling
                    options.Cookie.Name = "GoogleOAuthStateCookie";
                    options.Cookie.Path = "/";
                })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });
                /*.AddGoogle(options =>
                {
                    options.ClientId = builder.Configuration["GoogleAuth:ClientId"];
                    options.ClientSecret = builder.Configuration["GoogleAuth:ClientSecret"];

                    // Explicit callback path
                    options.CallbackPath = "/api/auth/google-callback";

                    options.SaveTokens = true;

                    // More robust state handling
                    options.CorrelationCookie.Name = ".AspNetCore.GoogleOAuth.Correlation";
                    options.CorrelationCookie.HttpOnly = true;
                    options.CorrelationCookie.SameSite = SameSiteMode.Lax;
                    options.CorrelationCookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;

                    options.Events = new OAuthEvents
                    {
                        OnRemoteFailure = context =>
                        {
                            // Detailed logging
                            Console.WriteLine($"OAuth Remote Failure: {context.Failure?.Message}");
                            Console.WriteLine($"Failure Details: {context.Failure}");

                            context.Response.StatusCode = 500;
                            context.Response.ContentType = "application/json";
                            context.HandleResponse();
                            return context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new
                            {
                                message = "Google OAuth failed",
                                error = context.Failure?.Message,
                                details = context.Failure?.ToString()
                            }));
                        },
                        OnTicketReceived = context =>
                        {
                            Console.WriteLine("OAuth Ticket Received");
                            return Task.CompletedTask;
                        }
                    };
                });*/

            // Add CORS service
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    policy.WithOrigins(
                        "http://localhost:5173",
                        "https://skincare-booking-system-eight.vercel.app"
                    )
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
                });
            });

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<SkincareBookingSystemContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
            );

            /*====================================================*/
            builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IAccountService, AccountService>();
            builder.Services.AddScoped<IBookingService, BookingService>();
            builder.Services.AddScoped<ICustomerService, CustomerService>();
            builder.Services.AddScoped<ISkintherapistService, SkintherapistService>();
            builder.Services.AddScoped<ISlotService, SlotService>();
            builder.Services.AddScoped<IServiceService, ServiceService>();
            builder.Services.AddScoped<IScheduleService, ScheduleService>();
            builder.Services.AddScoped<ISkintypeService, BLL.Services.SkintypeService>();
            builder.Services.AddScoped<IQuizAnswerService, QuizAnswerService>();
            builder.Services.AddScoped<IQuizQuestionService, QuizQuestionService>();
            builder.Services.AddScoped<IQuizQuestionSetService, QuizQuestionSetService>();
            builder.Services.AddScoped<ICustomerSurveyService, CustomerSurveyService>();
            builder.Services.AddScoped<ICustomerSurveyAnswerService, CustomerSurveyAnswerService>();
            builder.Services.AddScoped<ISkintypeServiceService, SkintypeServiceService>();
            builder.Services.AddScoped<IDashboardService, DashboardService>();
            builder.Services.AddScoped<IRatingService, RatingService>();
            builder.Services.AddScoped<IBlogService, BlogService>();
            /*====================================================*/

            var emailConfig = builder.Configuration.GetSection("EmailSettings").Get<EmailSettingsDTO>();
            builder.Services.AddScoped<IEmailService>(_ => new EmailService(
                emailConfig.Host,   // "smtp.gmail.com"
                emailConfig.Port,   // 587
                emailConfig.Mail,   // "jackawmc@gmail.com"
                emailConfig.Password // "wpncykcsxigryaxz"
            ));

            /*====================================================*/

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseSwagger();
            app.UseSwaggerUI();

            if (app.Environment.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }
            app.UseHttpsRedirection();

            // Use CORS with the defined policy
            app.UseCors("AllowReactApp");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
