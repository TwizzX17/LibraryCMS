using LibraryCmsShared.Migrations;
using LibraryCmsShared.Models;
using System;

using System.Data.Entity;

namespace LibraryCmsShared
{
    public class Context : DbContext
    {
        public Context()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<Context, Configuration>());
        }
        public DbSet<Book> Books { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<BookGenres> BookGenres {  get; set; }
        public DbSet<Rental> Rentals { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Book>()
                .HasIndex(b => b.Title)
                .IsUnique();
        }
    }
}
