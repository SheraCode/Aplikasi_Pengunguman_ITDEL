import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:async';
import 'dart:convert';
import './hal_headset.dart' as headset;
import './hal_komputer.dart' as komputer;
import './hal_smartphone.dart' as smartphone;
import './hal_radio.dart' as radio;

void main() {
  runApp(MaterialApp(
    home: Home(),
  ));
}

class Home extends StatefulWidget {
  const Home({Key? key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> with SingleTickerProviderStateMixin {
  late TabController controller;
  List dataJSON = [];

  Future<void> ambildata() async {
    http.Response hasil = await http.get(
      Uri.parse("https://jsonplaceholder.typicode.com/posts"),
      headers: {"Accept": "application/json"},
    );
    this.setState(() {
      dataJSON = json.decode(hasil.body);
    });
  }

  @override
  void initState() {
    super.initState();
    controller = TabController(length: 4, vsync: this);
    ambildata();
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Institut Teknologi Del",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontFamily: 'serif',
          ),
        ),
        actions: <Widget>[
          Image(
            image: NetworkImage(
                "https://upload.wikimedia.org/wikipedia/commons/e/e2/Del_Institute_of_Technology_Logo.png"),
            width: 60.0,
          )
        ],
      ),
      body: TabBarView(
        controller: controller,
        children: <Widget>[
          komputer.Home(),
          smartphone.Home(),
          headset.Home(),
          radio.Home(),
        ],
      ),
      bottomNavigationBar: Material(
        color: Colors.blue,
        child: TabBar(
          controller: controller,
          tabs: <Widget>[
            Tab(icon: Icon(Icons.newspaper), text: "Berita",),
            Tab(icon: Icon(Icons.notifications_active), text: "Kemahasiswaan",),
            Tab(icon: Icon(Icons.menu_book), text: "Perpustakaan",),
            Tab(icon: Icon(Icons.monetization_on), text: "Bursar",),
          ],
        ),
      ),
    );
  }
}
