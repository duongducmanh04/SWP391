using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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

            //secret key from appsettings.json
            var jwtKey = builder.Configuration["Jwt:Key"];

            //JwtService -> Secret Key
            builder.Services.AddScoped<IJwtService>(_ => new JwtService(jwtKey));

            //Authentication -> JWT Bearer
            builder.Services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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

            // Add CORS service
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
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
            

            builder.Services.AddScoped<IBookingService, BookingService>();

            builder.Services.AddScoped<ISkintherapistService, SkintherapistService>();

            builder.Services.AddScoped<IAuthService, AuthService>();

            builder.Services.AddScoped<ISlotService, SlotService>();

            builder.Services.AddScoped<IServiceService, ServiceService>();

            builder.Services.AddScoped<IScheduleService, ScheduleService>();

            builder.Services.AddScoped<ISkintypeService, BLL.Services.SkintypeService>();

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
