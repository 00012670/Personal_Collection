using API.Context;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddEventSourceLogger();


// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
        });
});

// Add services to the container.
builder
    .Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/IdentityController/Login";
    });

builder.Services.AddAuthorization();

builder.Services.AddControllers();

builder.Services.AddSwaggerGen();




builder.Services.AddDbContext<DBContext>(o =>
{
    o.UseSqlServer(builder.Configuration.GetConnectionString("PesonalCollection"));
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AuthenticationService>();
builder.Services.AddScoped<ValidationService>();

builder.Services.Configure<JWTSettings>(builder.Configuration.GetSection("Jwt"));

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
});
app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

// Use the localization middleware
var localizationOptionsService = app.Services.GetService<IOptions<RequestLocalizationOptions>>();
if (localizationOptionsService != null)
{
    var localizationOptions = localizationOptionsService.Value;
    app.UseRequestLocalization(localizationOptions);
}
else
{
    // Handle the case when the service is not registered
    // For example, you can use a default RequestLocalizationOptions
    var defaultLocalizationOptions = new RequestLocalizationOptions
    {
        DefaultRequestCulture = new RequestCulture("en-US"),
    };
    app.UseRequestLocalization(defaultLocalizationOptions);
}
app.MapControllers();

app.UseCors("AllowAllOrigins");

app.Run();
