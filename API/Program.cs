using API.Context;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text.Json.Serialization;

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
            //   .WithOrigins("http://trustedwebsite.com")
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
    o.UseSqlServer(builder.Configuration.GetConnectionString("PersonalCollection"));
});

builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "wwwroot";
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AuthenticationService>();
builder.Services.AddScoped<ValidationService>();
builder.Services.Configure<JWTSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddControllers().AddJsonOptions(x =>
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve
);

var app = builder.Build();


// Check database connection
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<DBContext>();
        context.Database.OpenConnection();
        Console.WriteLine("Successfully connected to the database.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred while connecting to the database: {ex.Message}");
    }
    finally
    {
        var context = services.GetRequiredService<DBContext>();
        if (context.Database.GetDbConnection().State == System.Data.ConnectionState.Open)
        {
            context.Database.CloseConnection();
        }
    }
}

// Use developer exception page in development environment
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

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
    var defaultLocalizationOptions = new RequestLocalizationOptions
    {
        DefaultRequestCulture = new RequestCulture("en-US"),
    };
    app.UseRequestLocalization(defaultLocalizationOptions);
}
app.MapControllers();

app.UseCors("AllowAllOrigins");

app.Run();
