using BookTracker.Api.Data;
using BookTracker.Api.Features.Books;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<BooksDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.MapBooksEndpoints();

app.Run();

