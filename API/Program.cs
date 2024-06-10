
using API.Context;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddEventSourceLogger();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder
            .AllowAnyOrigin()
            // .WithOrigins("https://personalcollection.azurewebsites.net/")
            .AllowAnyMethod()
            .AllowAnyHeader();
        });
});

builder
    .Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/IdentityController/Login";
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers()
.AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);

builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DBContext>(o =>
{
   // o.UseSqlServer(builder.Configuration.GetConnectionString("ProdConnection"));
    o.UseSqlServer(builder.Configuration.GetConnectionString("PersonalCollection"));
});
builder.Services.Configure<JiraSettings>(builder.Configuration.GetSection("JiraSettings"));

builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "wwwroot";
});
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AuthenticationService>();
builder.Services.AddScoped<ValidationService>();
builder.Services.AddScoped<LikeService>();
builder.Services.Configure<JWTSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddControllers().AddJsonOptions(x =>
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve
);
builder.Services.AddHttpClient();
builder.Services.AddScoped<JiraServiceBase, JiraService>();
builder.Services.AddScoped<JiraIssueService>();
builder.Services.AddScoped<JiraUserService>();
builder.Logging.AddDebug();
builder.Logging.AddConsole();


var app = builder.Build();

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
app.MapControllers();
app.UseCors("AllowAllOrigins");
app.Run();