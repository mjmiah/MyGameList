using Microsoft.EntityFrameworkCore;
using MyGameList;
using MyGameList.Helpers;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IConfiguration>(builder.Configuration); // make builder.Configuration available for all services

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddOpenApi(); // Add OpenAPI services to WebApplicationBuilder
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DatabaseConnection"))); // DbContext dependency injection
builder.Services.AddScoped<AuthManager>(); // AuthManager dependency injection


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
    
}
else
{
    app.MapScalarApiReference();
    app.MapOpenApi(); // Endpoint to the app to serve the OpenAPI document 

}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
