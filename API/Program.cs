using System;
using System.Globalization;
using API.Context;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

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
builder.Services.AddScoped<API.Services.AuthenticationService>();
builder.Services.AddScoped<ValidationService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();

app.UseSwaggerUI();

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

app.Run();
